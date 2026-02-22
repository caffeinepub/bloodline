import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type BloodGroup = {
    #aPositive;
    #aNegative;
    #bPositive;
    #bNegative;
    #abPositive;
    #abNegative;
    #oPositive;
    #oNegative;
  };

  public type UserRole = {
    #user;
    #admin;
  };

  public type Location = {
    city : Text;
    latitude : Float;
    longitude : Float;
    address : Text;
  };

  public type UserProfile = {
    name : Text;
    bloodGroup : BloodGroup;
    role : UserRole;
    location : Location;
    available : Bool;
    contactPref : Text;
  };

  public type BloodRequest = {
    id : Text;
    requester : Principal;
    bloodGroup : BloodGroup;
    location : Location;
    urgency : { #critical; #high; #normal };
    status : { #pending; #matched; #completed; #cancelled };
    createdAt : Time.Time;
    matchedDonor : ?Principal;
  };

  public type ActiveLocation = {
    coordinates : {
      latitude : Float;
      longitude : Float;
    };
    type_ : { #donor; #request };
    bloodGroup : BloodGroup;
    requester : ?Principal;
    requestId : ?Text;
    urgency : ?{ #critical; #high; #normal };
    availability : ?Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let bloodRequests = Map.empty<Text, BloodRequest>();
  var nextRequestId = 1;

  // Profile management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Blood request management
  public shared ({ caller }) func createBloodRequest(bloodGroup : BloodGroup, location : Location, urgency : { #critical; #high; #normal }) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create blood requests");
    };

    let id = nextRequestId.toText();
    nextRequestId += 1;

    let request : BloodRequest = {
      id;
      requester = caller;
      bloodGroup;
      location;
      urgency;
      status = #pending;
      createdAt = Time.now();
      matchedDonor = null;
    };

    bloodRequests.add(id, request);
    id;
  };

  public shared ({ caller }) func updateBloodRequestStatus(requestId : Text, status : { #pending; #matched; #completed; #cancelled }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update request status");
    };

    switch (bloodRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        // Authorization: Only the requester, matched donor, or admin can update status
        let isRequester = caller == request.requester;
        let isMatchedDonor = switch (request.matchedDonor) {
          case (null) { false };
          case (?donor) { caller == donor };
        };
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isRequester or isMatchedDonor or isAdmin)) {
          Runtime.trap("Unauthorized: Only the requester, matched donor, or admin can update this request");
        };

        // Additional business logic: requesters can cancel, donors can mark completed
        if (status == #cancelled and not (isRequester or isAdmin)) {
          Runtime.trap("Unauthorized: Only the requester or admin can cancel a request");
        };

        let updatedRequest : BloodRequest = {
          id = request.id;
          requester = request.requester;
          bloodGroup = request.bloodGroup;
          location = request.location;
          urgency = request.urgency;
          status;
          createdAt = request.createdAt;
          matchedDonor = request.matchedDonor;
        };
        bloodRequests.add(requestId, updatedRequest);
      };
    };
  };

  // Find all matching donors for a blood group
  public query ({ caller }) func findDonorsForBloodGroup(bloodGroup : BloodGroup) : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can search for donors");
    };

    let donors = userProfiles.keys().toList();
    let matchingDonors = donors.filter(
      func(principal) {
        switch (userProfiles.get(principal)) {
          case (null) { false };
          case (?profile) {
            profile.available and isCompatible(profile.bloodGroup, bloodGroup);
          };
        };
      }
    );
    matchingDonors.toArray();
  };

  // Determine blood group compatibility
  func isCompatible(donor : BloodGroup, receiver : BloodGroup) : Bool {
    switch (receiver) {
      case (#oPositive) {
        switch (donor) {
          case (#oPositive) { true };
          case (#oNegative) { true };
          case (_) { false };
        };
      };
      case (#aPositive) {
        switch (donor) {
          case (#aPositive) { true };
          case (#aNegative) { true };
          case (#oPositive) { true };
          case (#oNegative) { true };
          case (_) { false };
        };
      };
      case (#bPositive) {
        switch (donor) {
          case (#bPositive) { true };
          case (#bNegative) { true };
          case (#oPositive) { true };
          case (#oNegative) { true };
          case (_) { false };
        };
      };
      case (#abPositive) {
        switch (donor) {
          case (#aPositive) { true };
          case (#aNegative) { true };
          case (#bPositive) { true };
          case (#bNegative) { true };
          case (#oPositive) { true };
          case (#oNegative) { true };
          case (#abPositive) { true };
          case (#abNegative) { true };
        };
      };
      case (#oNegative) {
        switch (donor) {
          case (#oNegative) { true };
          case (_) { false };
        };
      };
      case (#aNegative) {
        switch (donor) {
          case (#aNegative) { true };
          case (#oNegative) { true };
          case (_) { false };
        };
      };
      case (#bNegative) {
        switch (donor) {
          case (#bNegative) { true };
          case (#oNegative) { true };
          case (_) { false };
        };
      };
      case (#abNegative) {
        switch (donor) {
          case (#aNegative) { true };
          case (#bNegative) { true };
          case (#oNegative) { true };
          case (#abNegative) { true };
          case (_) { false };
        };
      };
    };
  };

  // Public function to get all requests for a user
  public query ({ caller }) func getRequestsForUser(user : Principal) : async [BloodRequest] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own requests");
    };
    let requests = bloodRequests.values().toList<BloodRequest>();
    let filteredRequests = requests.filter(
      func(request) { request.requester == user }
    );
    filteredRequests.toArray();
  };

  // Public function to get all active locations for map display
  public query ({ caller }) func getActiveLocations() : async [ActiveLocation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access location data");
    };

    let locations = List.empty<ActiveLocation>();

    // Add available donors
    for ((principal, profile) in userProfiles.entries()) {
      if (profile.available) {
        let donorLocation : ActiveLocation = {
          coordinates = {
            latitude = profile.location.latitude;
            longitude = profile.location.longitude;
          };
          type_ = #donor;
          bloodGroup = profile.bloodGroup;
          requester = ?principal;
          requestId = null;
          urgency = null;
          availability = ?profile.available;
        };
        locations.add(donorLocation);
      };
    };

    // Add active blood requests
    for ((id, request) in bloodRequests.entries()) {
      if (request.status == #pending or request.status == #matched) {
        let requestLocation : ActiveLocation = {
          coordinates = {
            latitude = request.location.latitude;
            longitude = request.location.longitude;
          };
          type_ = #request;
          bloodGroup = request.bloodGroup;
          requester = ?request.requester;
          requestId = ?id;
          urgency = ?request.urgency;
          availability = null;
        };
        locations.add(requestLocation);
      };
    };

    locations.toArray();
  };
};

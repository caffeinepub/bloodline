import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    latitude: number;
    city: string;
    longitude: number;
    address: string;
}
export type Time = bigint;
export interface ActiveLocation {
    requestId?: string;
    requester?: Principal;
    urgency?: Variant_normal_high_critical;
    type: Variant_request_donor;
    availability?: boolean;
    bloodGroup: BloodGroup;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}
export interface UserProfile {
    contactPref: string;
    name: string;
    role: UserRole;
    available: boolean;
    bloodGroup: BloodGroup;
    location: Location;
}
export interface BloodRequest {
    id: string;
    status: Variant_cancelled_pending_completed_matched;
    requester: Principal;
    urgency: Variant_normal_high_critical;
    createdAt: Time;
    bloodGroup: BloodGroup;
    matchedDonor?: Principal;
    location: Location;
}
export enum BloodGroup {
    aNegative = "aNegative",
    oPositive = "oPositive",
    abPositive = "abPositive",
    bPositive = "bPositive",
    aPositive = "aPositive",
    oNegative = "oNegative",
    abNegative = "abNegative",
    bNegative = "bNegative"
}
export enum UserRole {
    admin = "admin",
    user = "user"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_cancelled_pending_completed_matched {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    matched = "matched"
}
export enum Variant_normal_high_critical {
    normal = "normal",
    high = "high",
    critical = "critical"
}
export enum Variant_request_donor {
    request = "request",
    donor = "donor"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createBloodRequest(bloodGroup: BloodGroup, location: Location, urgency: Variant_normal_high_critical): Promise<string>;
    findDonorsForBloodGroup(bloodGroup: BloodGroup): Promise<Array<Principal>>;
    getActiveLocations(): Promise<Array<ActiveLocation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getRequestsForUser(user: Principal): Promise<Array<BloodRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBloodRequestStatus(requestId: string, status: Variant_cancelled_pending_completed_matched): Promise<void>;
}

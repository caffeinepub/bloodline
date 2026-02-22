import { BloodGroup } from '../backend';

export function formatBloodGroup(bloodGroup: BloodGroup): string {
  switch (bloodGroup) {
    case BloodGroup.aPositive:
      return 'A+';
    case BloodGroup.aNegative:
      return 'A-';
    case BloodGroup.bPositive:
      return 'B+';
    case BloodGroup.bNegative:
      return 'B-';
    case BloodGroup.abPositive:
      return 'AB+';
    case BloodGroup.abNegative:
      return 'AB-';
    case BloodGroup.oPositive:
      return 'O+';
    case BloodGroup.oNegative:
      return 'O-';
    default:
      return bloodGroup;
  }
}

export function isBloodGroupCompatible(donor: BloodGroup, receiver: BloodGroup): boolean {
  const compatibilityMap: Record<BloodGroup, BloodGroup[]> = {
    [BloodGroup.oNegative]: [
      BloodGroup.oNegative,
      BloodGroup.oPositive,
      BloodGroup.aNegative,
      BloodGroup.aPositive,
      BloodGroup.bNegative,
      BloodGroup.bPositive,
      BloodGroup.abNegative,
      BloodGroup.abPositive,
    ],
    [BloodGroup.oPositive]: [BloodGroup.oPositive, BloodGroup.aPositive, BloodGroup.bPositive, BloodGroup.abPositive],
    [BloodGroup.aNegative]: [BloodGroup.aNegative, BloodGroup.aPositive, BloodGroup.abNegative, BloodGroup.abPositive],
    [BloodGroup.aPositive]: [BloodGroup.aPositive, BloodGroup.abPositive],
    [BloodGroup.bNegative]: [BloodGroup.bNegative, BloodGroup.bPositive, BloodGroup.abNegative, BloodGroup.abPositive],
    [BloodGroup.bPositive]: [BloodGroup.bPositive, BloodGroup.abPositive],
    [BloodGroup.abNegative]: [BloodGroup.abNegative, BloodGroup.abPositive],
    [BloodGroup.abPositive]: [BloodGroup.abPositive],
  };

  return compatibilityMap[donor]?.includes(receiver) || false;
}

// Alias for compatibility
export function canDonateToReceiver(donor: BloodGroup, receiver: BloodGroup): boolean {
  return isBloodGroupCompatible(donor, receiver);
}

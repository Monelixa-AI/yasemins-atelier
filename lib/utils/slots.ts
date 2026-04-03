import { prisma } from "@/lib/db";

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export async function getAvailableSlots(serviceSlug: string, date: Date): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split("T")[0];

  try {
    const rule = await prisma.availabilityRule.findFirst({
      where: { serviceSlug, dayOfWeek, isActive: true },
    });
    if (!rule) return [];

    const blocked = await prisma.blockedDate.findFirst({
      where: {
        date: { gte: new Date(dateStr), lt: new Date(dateStr + "T23:59:59") },
        OR: [{ serviceSlug }, { serviceSlug: null }],
        startTime: null,
      },
    });
    if (blocked) return [];

    const slots: TimeSlot[] = [];
    const [startH, startM] = rule.startTime.split(":").map(Number);
    const [endH, endM] = rule.endTime.split(":").map(Number);
    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + rule.slotMinutes <= endMinutes) {
      const slotStart = minutesToTime(currentMinutes);
      const slotEnd = minutesToTime(currentMinutes + rule.slotMinutes);

      const existingBooking = await prisma.serviceBooking.findFirst({
        where: {
          serviceSlug,
          bookedDate: { gte: new Date(dateStr), lt: new Date(dateStr + "T23:59:59") },
          startTime: slotStart,
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
      });

      slots.push({ startTime: slotStart, endTime: slotEnd, available: !existingBooking });
      currentMinutes += rule.slotMinutes + rule.bufferMinutes;
    }
    return slots;
  } catch {
    return [];
  }
}

export async function getAvailableDates(serviceSlug: string, year: number, month: number): Promise<{ date: string; available: boolean }[]> {
  const results: { date: string; available: boolean }[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = date.toISOString().split("T")[0];

    if (date < today) {
      results.push({ date: dateStr, available: false });
      continue;
    }

    const dayOfWeek = date.getDay();
    const rule = await prisma.availabilityRule.findFirst({
      where: { serviceSlug, dayOfWeek, isActive: true },
    });

    if (!rule) {
      results.push({ date: dateStr, available: false });
      continue;
    }

    const blocked = await prisma.blockedDate.findFirst({
      where: {
        date: { gte: new Date(dateStr), lt: new Date(dateStr + "T23:59:59") },
        OR: [{ serviceSlug }, { serviceSlug: null }],
        startTime: null,
      },
    });

    results.push({ date: dateStr, available: !blocked });
  }
  return results;
}

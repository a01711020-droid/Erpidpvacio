// Supplier credit days directory
export const supplierCreditDays: Record<string, number> = {
  "CEMEX": 30,
  "LEVINSON": 15,
  "INTERCERAMIC": 30,
  "BEREL": 45,
  "HIERROS": 20,
  "HOME DEPOT": 0,
  "COMEX": 30,
  "TRUPER": 15,
  "FERRETERIA": 0,
  "TLAPALERIA": 0,
};

export function getSupplierCreditDays(supplierName: string): number {
  const normalizedName = supplierName.trim().toUpperCase();
  
  // Try exact match first
  if (supplierCreditDays[normalizedName] !== undefined) {
    return supplierCreditDays[normalizedName];
  }
  
  // Try partial match
  const matchingKey = Object.keys(supplierCreditDays).find(key => 
    normalizedName.includes(key) || key.includes(normalizedName)
  );
  
  return matchingKey ? supplierCreditDays[matchingKey] : 0;
}

export function calculateRemainingCreditDays(
  orderDate: string,
  creditDays: number
): number {
  if (creditDays === 0) return 0;
  
  const orderDateTime = new Date(orderDate).getTime();
  const currentTime = new Date().getTime();
  const daysPassed = Math.floor((currentTime - orderDateTime) / (1000 * 60 * 60 * 24));
  const remainingDays = creditDays - daysPassed;
  
  return Math.max(remainingDays, 0);
}

export function getCreditStatus(
  remainingDays: number,
  creditDays: number,
  isPaid: boolean
): "paid" | "warning" | "overdue" | "none" {
  if (isPaid) return "paid";
  if (creditDays === 0) return "none";
  if (remainingDays === 0) return "overdue";
  if (remainingDays <= 5) return "warning";
  return "none";
}

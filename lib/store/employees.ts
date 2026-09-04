export type StoreEmployee = {
    employeeId: string;
    name: string;
    designation: string;
    email: string;
    phone: string;
    website: string;
    image: string;
    verified: boolean;
    active: boolean;
};


export const employees: Record<string, StoreEmployee> = {
    EMP001: {
        employeeId: "EMP001",
        name: "Khaled Obaid Mubarak Aldhaheri",
        designation: "Founder & CEO",
        email: "theroyalchins@gmail.com",
        phone: "+971 50 262 5871",
        website: "https://www.royalchins.com",
        image: "/emp001.png",
        verified: true,
        active: true,
    },
};


export function getEmployeeById(
    employeeId: string
): StoreEmployee | null {
    const normalizedId =
        employeeId.trim().toUpperCase();

    return employees[normalizedId] ?? null;
}


export function getAllEmployeeIds() {
    return Object.keys(employees);
}
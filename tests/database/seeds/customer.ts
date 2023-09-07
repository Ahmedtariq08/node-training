import { ICustomer, Customer } from "../../../src/models/customerModel";
import { testLogger } from "../../config/testLogger";

const customers: ICustomer[] = [
    {
        name: 'Ahmed tariq',
        isGold: true,
        phone: '03484267637'
    },
    {
        name: 'Customer 2',
        phone: '12345698',
        isGold: false
    }
]

export const seedCustomers = async () => {
    try {
        await Customer.deleteMany({});
        await Customer.insertMany(customers);
        testLogger.info(`Seeded ${customers.length} customers in test database`);
    } catch (error) {
        testLogger.error('Error in seeding customers');
    }
}
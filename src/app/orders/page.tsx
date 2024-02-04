import { Flex, Heading } from "@radix-ui/themes";
import OrderTable from "@/app/components/ui/ordertable.js";
import { revalidatePath } from "next/cache";

export default function Page() {
  revalidatePath("/orders");
  return (
    <main>
      <Flex direction="column" m="6">
        <Heading>Orders</Heading>
        <OrderTable />
      </Flex>
    </main>
  );
}

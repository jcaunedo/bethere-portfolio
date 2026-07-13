import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "./data-table";

type Payment = {
  id: string;
  email: string;
  status: "pending" | "processing" | "success" | "failed";
  amount: number;
};

const data: Payment[] = [
  { id: "1", email: "ken@example.com", status: "success", amount: 316 },
  { id: "2", email: "abe@example.com", status: "success", amount: 242 },
  { id: "3", email: "monserrat@example.com", status: "processing", amount: 837 },
  { id: "4", email: "silas@example.com", status: "failed", amount: 721 },
  { id: "5", email: "carmella@example.com", status: "pending", amount: 95 },
  { id: "6", email: "jason@example.com", status: "success", amount: 410 },
  { id: "7", email: "lena@example.com", status: "processing", amount: 178 },
];

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        ${row.original.amount.toFixed(2)}
      </div>
    ),
  },
];

const meta: Meta<typeof DataTable<Payment, unknown>> = {
  title: "Data Display/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataTable<Payment, unknown>>;

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <DataTable columns={columns} data={data} />
    </div>
  ),
};

export const Searchable: Story = {
  render: () => (
    <div className="w-[640px]">
      <DataTable columns={columns} data={data} searchable pageSize={5} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[640px]">
      <DataTable columns={columns} data={[]} />
    </div>
  ),
};

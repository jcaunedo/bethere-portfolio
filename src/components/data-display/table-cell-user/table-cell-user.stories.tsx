import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableCellUser } from "./table-cell-user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/data-display/table";

const meta: Meta<typeof TableCellUser> = {
  title: "Data Display/TableCellUser",
  component: TableCellUser,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    email: { control: "text" },
    avatarUrl: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof TableCellUser>;

export const Default: Story = {
  args: {
    name: "Lucy Smith",
    email: "lucy@example.com",
  },
};

/** `avatarUrl` renders a photo instead of initials. */
export const WithPhoto: Story = {
  args: {
    name: "Marcus Webb",
    email: "marcus@example.com",
    avatarUrl: "https://i.pravatar.cc/72?img=12",
  },
};

/** Figma `row` (`Property 1=Avatar`) — the intended usage: a person column inside `Table`/`DataTable`. */
export const InTable: Story = {
  render: () => (
    <div className="w-full overflow-hidden rounded-xl bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <TableCellUser name="Lucy Smith" email="lucy@example.com" />
            </TableCell>
            <TableCell>Owner</TableCell>
            <TableCell className="text-right">$1,200.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TableCellUser
                name="Marcus Webb"
                email="marcus@example.com"
                avatarUrl="https://i.pravatar.cc/72?img=12"
              />
            </TableCell>
            <TableCell>Manager</TableCell>
            <TableCell className="text-right">$860.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

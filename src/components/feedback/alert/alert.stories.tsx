import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "Data Display/Alert",
  component: Alert,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[498px]">
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Description</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[498px]">
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Description</AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert variant="info" className="w-[498px]">
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Description</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-[498px]">
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Description</AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[498px] flex-col gap-3">
      <Alert variant="warning">
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
    </div>
  ),
};

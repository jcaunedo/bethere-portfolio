export { cn } from "./lib/utils";

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

export { Button, buttonVariants } from "./components/buttons/button";

export {
  ButtonNotifications,
  buttonNotificationsVariants,
} from "./components/buttons/button-notifications";

export {
  SocialLoginButton,
  socialLoginButtonVariants,
  GoogleIcon,
  MicrosoftIcon,
  AppleIcon,
  type SocialLoginButtonProps,
} from "./components/buttons/social-login-button";

export {
  SocialLoginOptions,
  type SocialLoginOptionsProps,
} from "./components/buttons/social-login-options";

/* -------------------------------------------------------------------------- */
/* Forms — primitives                                                         */
/* -------------------------------------------------------------------------- */

export { Input, inputVariants } from "./components/forms/input";

export { Textarea, textareaVariants } from "./components/forms/textarea";

export {
  SearchInput,
  type SearchInputProps,
} from "./components/forms/search-input";

export {
  NumericInput,
  type NumericInputProps,
} from "./components/forms/numeric-input";

export {
  PaymentMethod,
  paymentMethodVariants,
  type PaymentMethodProps,
} from "./components/forms/payment-method";

export {
  Combobox,
  type ComboboxOption,
  type ComboboxProps,
} from "./components/forms/combobox";

export {
  DatePicker,
  type DatePickerProps,
} from "./components/forms/date-picker";

export { Calendar } from "./components/forms/calendar";

export {
  OtpInput,
  OtpInputGroup,
  OtpInputSlot,
  OtpInputSeparator,
  otpInputSlotVariants,
  type OtpInputProps,
} from "./components/forms/otp-input";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/forms/select";

/* -------------------------------------------------------------------------- */
/* Forms — Formik-connected fields (require the optional `formik` peer)        */
/* -------------------------------------------------------------------------- */

export { FormField, type FormFieldProps } from "./components/forms/field";

export { FormikInput, type FormikInputProps } from "./components/forms/input";

export {
  FormikTextarea,
  type FormikTextareaProps,
} from "./components/forms/textarea";

export {
  FormikNumericInput,
  type FormikNumericInputProps,
} from "./components/forms/numeric-input";

export {
  FormikSearchInput,
  type FormikSearchInputProps,
} from "./components/forms/search-input";

export {
  FormikSelect,
  type FormikSelectProps,
  type FormikSelectOption,
} from "./components/forms/select";

export {
  FormikOtpInput,
  type FormikOtpInputProps,
} from "./components/forms/otp-input";

export {
  FormikCombobox,
  type FormikComboboxProps,
} from "./components/forms/combobox";

export {
  FormikDatePicker,
  type FormikDatePickerProps,
} from "./components/forms/date-picker";

/* -------------------------------------------------------------------------- */
/* Data display                                                               */
/* -------------------------------------------------------------------------- */

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "./components/data-display/avatar";

export { SelectBusinessSwitcher } from "./components/data-display/select-business-switcher";

export { SelectAccountInfo } from "./components/data-display/select-account-info";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/data-display/table";

export {
  DataTable,
  DataTableColumnHeader,
  type DataTableProps,
  type DataTableColumnHeaderProps,
} from "./components/data-display/data-table";

/* -------------------------------------------------------------------------- */
/* Feedback                                                                   */
/* -------------------------------------------------------------------------- */

export {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariants,
} from "./components/feedback/alert";

/* -------------------------------------------------------------------------- */
/* Overlays                                                                   */
/* -------------------------------------------------------------------------- */

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./components/overlays/command";

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./components/overlays/popover";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export {
  Sidebar,
  SidebarMenuItem,
  SidebarDivider,
  SidebarPromotion,
  type SidebarProps,
  type SidebarBusiness,
  type SidebarAccountInfo,
} from "./components/navigation/sidebar";

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

export {
  CardAddListingCategory,
  cardAddListingCategoryVariants,
  type CardAddListingCategoryProps,
} from "./components/cards/card-add-listing-category";

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

export {
  Typography,
  typographyVariants,
  type TypographyProps,
  type TypographySize,
  type TypographyWeight,
} from "./components/typography";

/* -------------------------------------------------------------------------- */
/* Stepper                                                                    */
/* -------------------------------------------------------------------------- */

export {
  StepIndicator,
  stepIndicatorVariants,
} from "./components/stepper/step-indicator";

export { StepperOnboarding } from "./components/stepper/stepper-onboarding";

export { StepperExperience } from "./components/stepper/stepper-experience";

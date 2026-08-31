export { cn } from "./lib/utils";

export {
  formatRelativeDate,
  RELATIVE_CUTOVER,
  type RelativeDate,
} from "./lib/relative-date";

export {
  motionDuration,
  motionDistance,
  motionScale,
  motionStagger,
  standardTransition,
  enterTransition,
  exitTransition,
  subtleSpring,
  responsiveSpring,
  layoutSpring,
  fadeVariants,
  revealVariants,
  dismissVariants,
  overlayVariants,
  panelVariants,
  slideVariants,
  staggerContainerVariants,
  liftPattern,
  pressPattern,
  mediaHoverPattern,
  glidePattern,
  confirmPattern,
  reducedMotionTransition,
  resolveTransition,
  useMotionPreference,
} from "./lib/motion";

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
  SearchTrigger,
  type SearchTriggerProps,
} from "./components/forms/search-trigger";

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

export {
  RoleSelect,
  ROLE_OPTIONS,
  type RoleSelectProps,
  type TeamRole,
} from "./components/forms/role-select";

export {
  SettingsDetailRow,
  type SettingsDetailRowProps,
} from "./components/forms/settings-detail-row";

export { Switch } from "./components/forms/switch";

export {
  NotificationSwitcher,
  notificationSwitcherVariants,
  type NotificationSwitcherProps,
  type NotificationChannel,
} from "./components/forms/notification-switcher";

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

export {
  AvatarFiles,
  avatarFilesVariants,
} from "./components/data-display/avatar-files";

export { Badge, badgeVariants } from "./components/data-display/badge";

export {
  RowDocuments,
  rowDocumentsVariants,
  type RowDocumentsProps,
} from "./components/data-display/row-documents";

export { SelectBusinessSwitcher } from "./components/data-display/select-business-switcher";

export { SelectAccountInfo } from "./components/data-display/select-account-info";

export { Promotion } from "./components/data-display/promotion";

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

export {
  TableCellUser,
  type TableCellUserProps,
} from "./components/data-display/table-cell-user";

export {
  Symbol,
  symbolVariants,
  type SymbolProps,
} from "./components/data-display/symbol";

export {
  Logo,
  logoVariants,
  type LogoProps,
} from "./components/data-display/logo";

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

export {
  AccountMenu,
  AccountMenuContent,
  AccountMenuGroup,
  AccountMenuItem,
  AccountMenuLabel,
  AccountMenuPortal,
  AccountMenuSeparator,
  AccountMenuTrigger,
} from "./components/overlays/account-menu";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./components/overlays/dialog";

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./components/overlays/dropdown-menu";

export {
  InviteTeamMembersDialog,
  type InviteTeamMembersDialogProps,
} from "./components/overlays/invite-team-members-dialog";

export {
  EditMemberDialog,
  type EditMemberDialogProps,
  type EditMemberDialogMember,
} from "./components/overlays/edit-member-dialog";

export {
  ConfirmDialog,
  type ConfirmDialogProps,
} from "./components/overlays/confirm-dialog";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export {
  Sidebar,
  SidebarMenuItem,
  SidebarDivider,
  type SidebarProps,
  type SidebarBusiness,
  type SidebarAccountInfo,
  type SidebarAccountMenuItem,
  type SidebarNavItem,
} from "./components/navigation/sidebar";

export {
  SettingsHeader,
  type SettingsHeaderProps,
} from "./components/navigation/settings-header";

export {
  ProfileHeader,
  type ProfileHeaderProps,
} from "./components/navigation/profile-header";

export {
  SidebarSettings,
  type SidebarSettingsProps,
} from "./components/navigation/sidebar-settings";

export {
  NavigationListItem,
  type NavigationListItemProps,
} from "./components/navigation/navigation-list-item";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsTriggerVariants,
} from "./components/navigation/tabs";

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

export {
  CardAddListingCategory,
  cardAddListingCategoryVariants,
  type CardAddListingCategoryProps,
} from "./components/cards/card-add-listing-category";

export {
  CardBusiness,
  cardBusinessVariants,
  type CardBusinessProps,
} from "./components/cards/card-business";

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

/* -------------------------------------------------------------------------- */
/* Layouts                                                                    */
/* -------------------------------------------------------------------------- */

/*
  Most `src/layouts/` compositions stay internal — they are structural
  references for consumers to mirror. The Account Settings shells are the
  exception: the settings section's chrome (header + rail, and its mobile menu
  counterpart) is identical in every consuming app, so shipping it keeps one
  implementation instead of a re-creation per app. Their nav is fully
  parent-driven via `items`/`activeItem`/`onNavigate`, so nothing about the
  consumer's routing is baked in here.
*/

export {
  AccountSettingsLayout,
  settingsMenuItems,
  type AccountSettingsLayoutProps,
} from "./layouts/account-settings/account-settings";

export {
  AccountSettingsMenuLayout,
  type AccountSettingsMenuLayoutProps,
} from "./layouts/account-settings/account-settings-menu";

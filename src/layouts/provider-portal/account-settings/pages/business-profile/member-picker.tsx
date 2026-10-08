import { XIcon } from "lucide-react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/forms/select";
import { Button } from "@/components/buttons/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/data-display/avatar";
import { ACTIVE_MEMBERS } from "@/layouts/provider-portal/account-settings/pages/team-members/team-members";
import type { TeamMember } from "@/layouts/provider-portal/account-settings/pages/team-members/team-members";

/** "Lucy Smith" → "LS"; falls back to the first two characters if there's no space. */
function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MemberAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
	return (
		<Avatar size="sm">
			{avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
			<AvatarFallback colorSeed={name}>{initialsFromName(name)}</AvatarFallback>
		</Avatar>
	);
}

/** Collapsed HasValue display shared by Business owner/Primary contact — avatar + name/job title. */
function MemberSummary({
	name,
	title,
	avatarUrl,
}: {
	name: string;
	title: string;
	avatarUrl?: string;
}) {
	return (
		<div className="mt-1 flex items-center gap-2">
			<Avatar size="lg" className="shrink-0">
				{avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
				<AvatarFallback colorSeed={name}>{initialsFromName(name)}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className="text-base text-foreground">{name}</span>
				<span className="text-sm text-muted-foreground">{title}</span>
			</div>
		</div>
	);
}

/**
 * Team-member Select shared by Business owner/Primary contact's edit form,
 * plus a "clear" button (Figma: ghost, X icon) beside it — clicking it
 * removes the current selection and drops the row straight back to its
 * empty Add state, same as picking a member (both commit immediately, no
 * separate Save step).
 */
function MemberPicker({
	value,
	onChange,
	selectedMember,
}: {
	value: string;
	onChange: (email: string) => void;
	selectedMember: TeamMember | undefined;
}) {
	return (
		<div className="flex w-full items-center gap-2">
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger
					className="w-full"
					avatar={
						selectedMember ? (
							<MemberAvatar name={selectedMember.name} avatarUrl={selectedMember.avatarUrl} />
						) : undefined
					}
				>
					<SelectValue placeholder="Select a team member" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Select team member</SelectLabel>
						{ACTIVE_MEMBERS.map((member) => (
							<SelectItem
								key={member.email}
								value={member.email}
								avatar={<MemberAvatar name={member.name} avatarUrl={member.avatarUrl} />}
							>
								{member.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{value ? (
				<Button
					type="button"
					variant="ghost"
					size="icon-lg"
					aria-label="Remove selected team member"
					onClick={() => onChange("")}
					className="shrink-0 text-muted-foreground hover:text-foreground"
				>
					<XIcon />
				</Button>
			) : null}
		</div>
	);
}

export { MemberAvatar, MemberSummary, MemberPicker };

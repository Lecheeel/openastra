import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, ExternalLink, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Connection } from "@/app/connection/types";
import { integrationRegistry, getAuthMethodLabel } from "@/lib/registry";
import Link from "next/link";

interface ConnectionCardProps {
	connection: Connection;
	onEdit: (connection: Connection) => void;
	onDelete: (connection: Connection) => void;
}

export function ConnectionCard({
	connection,
	onEdit,
	onDelete,
}: ConnectionCardProps) {
	const integrationData = integrationRegistry[connection.type];

	if (!integrationData) {
		return null; // Or render a fallback card for unknown integration types
	}

	return (
		<Card className="hover:bg-secondary/50 transition-colors">
			<CardHeader className="p-6 flex flex-row items-start justify-between space-y-0">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<div className="size-8 rounded-lg flex items-center justify-center bg-primary/10">
							<svg
								role="img"
								viewBox="0 0 24 24"
								className="size-5 text-primary"
								fill="currentColor"
							>
								<path d={integrationData.icon.path} />
							</svg>
						</div>
						<div className="flex flex-col">
							<span className="font-semibold text-sm">{connection.name}</span>
							<span className="text-xs text-muted-foreground capitalize">
								{integrationData.category}
							</span>
						</div>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="size-8 p-0">
							<MoreVertical className="size-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onEdit(connection)}>
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(connection)}
							className="text-destructive"
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent className="px-6 py-2 space-y-4">
				<p className="text-sm text-muted-foreground">
					{integrationData.description}
				</p>

				<div className="flex flex-wrap gap-2">
					{integrationData.authMethods.map((method) => (
						<Badge
							key={method}
							variant="outline"
							className="bg-primary/10 text-primary text-xs hover:bg-primary/20"
						>
							{getAuthMethodLabel(method)}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="px-6 pt-4">
				<div className="flex items-center justify-between w-full text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<LayoutGrid className="size-3 text-orange-500" />
						{integrationData.apiEndpointCount} actions
					</div>
					<Link
						href={integrationData.docsUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 text-xs text-primary hover:underline"
					>
						<ExternalLink className="size-3" />
						Documentation
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}

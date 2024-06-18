import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import React from "react";
import WelcomeButtons from "@/components/welcomeButtons";

export default function IndexPage() {

	return (
		<DefaultLayout>
			<WelcomeButtons />
		</DefaultLayout>
	);
}

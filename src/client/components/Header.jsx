import reactLogo from "../assets/react.svg"

import { Title, Group, Flex, ActionIcon } from "@mantine/core"

import { ThemeSwitcher } from "./ThemeSwitcher"
import { IconBrandGithub } from "@tabler/icons-react"


export const Header = () =>
{
    return (
        <div className="header">
            <Flex justify="space-between" align="center" h="100%" px="md">
                <Group h="100%">
                    <a href="https://reactjs.org" target="_blank"><img src={reactLogo} className="logo react" alt="React logo" /></a>
                    <Title order={1}>Cartographer</Title>
                </Group>

                <Group>
                    <ActionIcon component="a" href="https://github.com/dionfleury/cartographer" variant="default" size="lg"><IconBrandGithub /></ActionIcon>
                    <ThemeSwitcher />
                </Group>
            </Flex>
        </div>
    )
}
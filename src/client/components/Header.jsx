import reactLogo from "../assets/react.svg"

import { Group, Flex } from "@mantine/core"

import { ThemeSwitcher } from "./ThemeSwitcher"


export const Header = () =>
{


    return (
        <div className="header">
            <Flex justify="space-between" align="center" h="100%" px="md">
                <Group h="100%">
                    <a href="https://reactjs.org" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                    <span>Cartographer</span>
                </Group>


                <Group>
                    <ThemeSwitcher />
                </Group>


            </Flex>



        </div>


    )
}
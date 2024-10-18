import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { IconSun, IconMoonStars } from '@tabler/icons-react'


export const ThemeSwitcher = () =>
{
    const { setColorScheme } = useMantineColorScheme()
    const computedColorScheme = useComputedColorScheme( 'light', { getInitialValueInEffect: true } )

    return (
        <ActionIcon
            onClick={() => setColorScheme( computedColorScheme === 'light' ? 'dark' : 'light' )}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
        >
            {computedColorScheme === "dark" ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
        </ActionIcon>
    )
}
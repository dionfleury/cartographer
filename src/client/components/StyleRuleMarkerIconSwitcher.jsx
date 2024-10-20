import { useState } from "react"
import { ActionIcon, Combobox, useCombobox, Group } from "@mantine/core"
import { IconCircle, IconSquare, IconTriangle, IconStar, IconPlus, IconX } from "@tabler/icons-react"

import { StyleRuleMakerIcon } from "./StyleRuleMarkerIcon"

const markeroptions = [
    { name: 'Circle', icon: IconCircle, },
    { name: 'Square', icon: IconSquare, },
    { name: 'Triangle', icon: IconTriangle, },
    { name: 'Star', icon: IconStar, },
    { name: 'Cross', icon: IconPlus, },
    { name: 'X', icon: IconX, }
]

const options = markeroptions.map( ( entry ) =>
{
    const IconTagName = entry.icon
    return (
        < Combobox.Option value={entry.icon} key={entry.name} >
            <Group>
                <IconTagName></IconTagName>
                {entry.name}
            </Group>
        </Combobox.Option >
    )
} )

export const StyleRuleMarkerIconSwitcher = ( { stroke, fill, onIconChange } ) =>
{
    const [ selectedShape, setSelectedShape ] = useState( IconCircle )
    const [ hasFill, setHasFill ] = useState( true )
    const combobox = useCombobox( { onDropdownClose: () => combobox.resetSelectedOption(), } )


    function handleValueChange( value )
    {
        setSelectedShape( value );
        ( value === IconPlus || value === IconX ) ? onIconChange( false ) : onIconChange( true )
        combobox.closeDropdown()
    }


    return (
        <>
            <Combobox
                store={combobox}
                width={250}
                position="bottom-start"
                withArrow
                onOptionSubmit={handleValueChange}
            >
                <Combobox.Target>
                    <ActionIcon variant="subtle" color="red" size="xl" onClick={() => combobox.toggleDropdown()}>
                        <StyleRuleMakerIcon icon={selectedShape} stroke={stroke} fill={fill} />
                    </ActionIcon>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
        </>

    )
}
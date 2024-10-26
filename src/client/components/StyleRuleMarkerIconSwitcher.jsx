import { useState } from "react"
import { ActionIcon, Combobox, useCombobox, Group } from "@mantine/core"
import { IconCircle, IconSquare, IconTriangle, IconStar, IconPlus, IconX } from "@tabler/icons-react"

import { StyleRuleMakerIcon } from "./StyleRuleMarkerIcon"

const markeroptions = [
    { name: 'circle', iconName: IconCircle, },
    { name: 'square', iconName: IconSquare, },
    { name: 'triangle', iconName: IconTriangle, },
    { name: 'star', iconName: IconStar, },
    { name: 'cross', iconName: IconPlus, },
    { name: 'x', iconName: IconX, }
]

const options = markeroptions.map( ( entry ) =>
{
    const IconTagName = entry.iconName
    return (
        < Combobox.Option value={entry.iconName} key={entry.name} >
            <Group>
                <IconTagName></IconTagName>
                {entry.name}
            </Group>
        </Combobox.Option >
    )
} )

export const StyleRuleMarkerIconSwitcher = ( { stroke, fill, icon, onIconChange } ) =>
{
    const [ selectedShape, setSelectedShape ] = useState( )
    const combobox = useCombobox( { onDropdownClose: () => combobox.resetSelectedOption(), } )


    function handleValueChange( value )
    {
        // setSelectedShape( value )
        onIconChange( { icon: value.displayName, hasFill: ( value === IconPlus || value === IconX ) ? false : true } )
        combobox.closeDropdown()
    }

    function handleIconChange( event )
    {
        // event.stopPropagation()
        combobox.toggleDropdown()
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
                    <ActionIcon variant="subtle" color="gray" size="xl" onClick={handleIconChange}>
                        <StyleRuleMakerIcon icon={markeroptions.find( option => option.name === icon ).iconName } stroke={stroke} fill={fill} />
                    </ActionIcon>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
        </>

    )
}
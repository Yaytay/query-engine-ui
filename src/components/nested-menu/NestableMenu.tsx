import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from '@mui/material/MenuItem';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Box from "@mui/material/Box";


export interface NestableMenuItemData {
  key?: string;
  caption: string;
  callback: (event: React.MouseEvent<HTMLElement>, item: NestableMenuItemData) => void;
  items?: NestableMenuItemData[];
}

interface NestableMenuProps {
  menuItems: NestableMenuItemData[];
  anchor: HTMLElement | null;
  MenuProps?: any
  ButtonProps?: any
  onClick?: any
  onClose?: any
}
function NestableMenu(props: NestableMenuProps) {

  const open = Boolean(props.anchor);

  function renderMenuItems(menuItems: NestableMenuItemData[]) {
    return menuItems.map(menuItem => {
      if (menuItem.items) {
        return (
          <SubMenuItem key={menuItem.key}
            menuItems={menuItem.items}
            caption={menuItem.caption}
          />
        )

      } else {
        return (
          <MenuItem key={menuItem.key} onClick={(evt) => {
            menuItem.callback(evt, menuItem)
            }} >
            {menuItem.caption}
          </MenuItem>
        )
      }
    })
  }

  return (
    <Menu anchorEl={props.anchor} open={open} onClose={props.onClose} >
      {
        renderMenuItems(props.menuItems)
      }
    </Menu>
  )

  interface SubMenuItemProps {
    caption: string
    menuItems: NestableMenuItemData[]
  }

  function SubMenuItem(props: SubMenuItemProps) {
    const [childAnchor, setChildAnchor] = React.useState<null | HTMLElement>(null);
    const open = Boolean(childAnchor);

    function handleClick(event: React.MouseEvent<HTMLElement>) {
      setChildAnchor(event.currentTarget);
    }

    function handleSubMenuClose(event: React.MouseEvent<HTMLElement>) {
      setChildAnchor(null);
    }

    return (
      <div>
        <MenuItem onClick={handleClick}>
          <Box display="flex" justifyContent="space-between" width="100%">
            {props.caption}
            <ArrowRightIcon />
          </Box>
        </MenuItem>
        <Menu
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
          anchorEl={childAnchor}
          open={open}
          onClose={handleSubMenuClose}
        >
          {
            renderMenuItems(props.menuItems)
          }
        </Menu>
      </div>
    );
  }
}

export default NestableMenu;
import { Divider, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useStores } from '../../store/contexts.store';
import { startCase } from 'lodash';
import { NavLink } from 'react-router-dom'

interface ISideBarProps {
}

const SideBar: React.FunctionComponent<ISideBarProps> = (props) => {
    const { store } = useStores();

    return (
        <Drawer open={store.showSideBar} onClose={() => store.toggleSideBar(false)}>
            <List style={{
                width: '230px'
            }}>
                {['home', 'my-work'].map((text, index) => (
                    <>
                        < NavLink to={`/${text}`} >
                            <ListItem button key={text}>
                                <ListItemText primary={startCase(text)} />
                            </ListItem>
                        </NavLink>
                        <Divider />
                    </>

                ))}
            </List>
        </Drawer>
    );
};

export default observer(SideBar);

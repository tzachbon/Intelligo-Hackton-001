import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useStores } from '../../store/contexts.store';
import { Fab } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import './top-bar.scss';
interface ITopBarProps {

}

const TopBar: React.FunctionComponent<ITopBarProps> = (props) => {
    const {
        store
    } = useStores()



    return (
        <Fab className='menu-icon' onClick={e => store.toggleSideBar(true)}>
            <MenuIcon></MenuIcon>
        </Fab>
    );
};

export default observer(TopBar);

// @flow
import * as React from 'react';
import styles from './DuiPreload.module.scss';

type Props = {
    
};
type State = {

};



export class DuiPreload extends React.Component<Props, State> {
    render() {
        return (
            <div className = { styles.wrapper }>

                <div className = { styles.circle }/>
                <div className = { styles.logo }>
                    <i className = 'icon-logo'/>
                </div>
            </div>
        )
    }
}
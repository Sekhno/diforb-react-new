import React, {Fragment, useState} from 'react';
import { Avatar } from 'primereact/avatar'

interface Props {
    photo: string;
}

export const DuiAvatar = (props: Props) => {
    const { photo } = props;
    const [error, setError] = useState(false)

    return(
        <Fragment>
            {
                photo && !error
                    ? <Avatar image = { photo } shape = 'circle' onImageError={() => setError(true)}/>
                        : <Avatar icon = 'icon-avatar' shape = 'circle'/>
            }
        </Fragment>
    )
}

export default DuiAvatar
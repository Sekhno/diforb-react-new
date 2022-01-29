import React, { Fragment } from 'react';

interface Props {
    icon: string,
    name: string
}

const SubName = (props: Props) =>
{
    const { name, icon } = props;

    return <Fragment>
        <i className = { icon }/>
        <span datatype = { name }>{ name }</span>
    </Fragment>
}

export default SubName;
import { h, Component, Fragment } from 'preact';
import { Field } from './cardTemplate';

interface FieldsProps {
    noteType: string,
    fields: Field[],
}

export default class Fields extends Component<FieldsProps> {
    render(props: FieldsProps, _state: any) {
        return (
            <Fragment>
                <b>Fields:</b> <br />
                <ul>
                    {props.fields && props.fields.map((field: Field) =>
                        <li><label>{field.name}:<textarea name={field.name}>{field.value}</textarea></label></li>
                    )}
                </ul>
            </Fragment>
        );
    }
}

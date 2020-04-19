import { h, Component, Fragment } from 'preact';
import { Field } from './cardTemplate';

interface FieldsProps {
    noteType: string,
    fields: Field[],
}

export default class Fields extends Component<FieldsProps> {
    render(props: FieldsProps, _state: any) {
        return (
            props.fields && props.fields.map((field: Field) =>
                <Fragment><label>{field.name}:</label> <textarea name={field.name}>{field.value}</textarea></Fragment>
            )
        );
    }
}

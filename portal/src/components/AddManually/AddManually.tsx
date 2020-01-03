import * as React from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import { Fab, Dialog, DialogTitle, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';
import { BehaviorSubject } from 'rxjs';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


export class FormControl<T = any> {
    _valueChanged = new BehaviorSubject<T>(null as unknown as any);
    valid = true
    constructor(_value: T, private validation?: (value: any) => boolean) {
        this.value = _value;
        this.valid = this.validation ? this.validation(this.value) : true;
    }

    get value() {
        return this._valueChanged.value;
    }

    get valueChanged() {
        return this._valueChanged.asObservable();
    }

    set value(newValue: T) {
        this._valueChanged.next(newValue);
        this.valid = this.validation ? this.validation(this.value) : true;

    }



}


interface IAddManuallyProps {
}

const _AddDialog: React.FunctionComponent<{ dialogOpen: boolean, onClose: any }> = (props) => {
    const [form, setForm] = React.useState(
        {
            controls: {
                start: new FormControl('', (value) => !!value),
                end: new FormControl('', (value) => !!value)
            },
            change: false
        }
    )

    const onChange = (value: Date | null, type: 'start' | 'end') => {
        const temp = { ...form };
        if (value) {
            temp.controls[type].value = value.getTime().toString();
            setForm(temp);
        }
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Dialog className="add-dialog" open={props.dialogOpen} onClose={props.onClose}>
                <DialogTitle id="simple-dialog-title">Add Time Manually</DialogTitle>
                <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Start date"
                    value={new Date(+(form.controls.start.value))}
                    onChange={e => onChange(e, 'start')}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
                <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="End date"
                    value={new Date(+(form.controls.end.value))}
                    onChange={e => onChange(e, 'end')}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
                <Button onClick={props.onClose}>Save</Button>
            </Dialog>
        </MuiPickersUtilsProvider>
    )
}

const AddDialog = observer(_AddDialog);

const AddManually: React.FunctionComponent<IAddManuallyProps> = (props) => {
    const localStore = useLocalStore(() => ({
        dialogOpen: false
    }))

    return (
        <>
            <Fab onClick={() => localStore.dialogOpen = true} className={classNames('add-manually')}>
                <AddIcon></AddIcon>
            </Fab>
            <AddDialog
                dialogOpen={localStore.dialogOpen}
                onClose={() => localStore.dialogOpen = !localStore.dialogOpen}
            ></AddDialog>
        </>
    );
};

export default observer(AddManually);

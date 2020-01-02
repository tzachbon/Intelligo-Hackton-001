import { Button, TextField, CircularProgress } from '@material-ui/core';
import { observer, useLocalStore } from 'mobx-react';
import * as React from 'react';
import { BehaviorSubject } from 'rxjs';
import { classNames } from '../../../utils/general.util';
import './Login.scss';
import * as firebase from 'firebase';
import { useStores } from '../../store/context.store';
import { useLocalStorage } from '../../../utils/react/use-chrome';

interface ILoginProps {
}


export class FormControl<T> {
    _valueChanged = new BehaviorSubject<T>(null);
    valid = true
    constructor(_value: T, private validation?: (value) => boolean) {
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

function onIsValid(controls: { [key: string]: FormControl<string> }) {
    if (controls) {
        let _isValid = true;
        Object
            .values(controls as { [key: string]: FormControl<string> })
            .forEach(control => {
                _isValid = _isValid && control.valid;
            })
        return _isValid;
    } else {
        return false;
    }
}

function emailValidation(value: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = re.test(String(value).toLowerCase());
    return isValid;
}

function passwordValidation(value: string) {
    const isValid = value.length > 5;
    return isValid;
}

const Login: React.FunctionComponent<ILoginProps> = (props) => {

    const {
        auth
    } = useStores()

    const [user, setUser, removeUser] = useLocalStorage<{ email: string, password: string }>('user')

    const localState = useLocalStore(() => ({
        loading: true
    }))
    const form = useLocalStore(() => ({
        controls: {
            email: new FormControl('', emailValidation),
            password: new FormControl('', passwordValidation)
        },
        error: '',
        isValid: true,
        get value() {
            const values = {};
            Object.entries(this.controls as { [key: string]: FormControl<string> })
                .forEach(([key, control]) => {
                    Object.assign(values, { [key]: control.value })
                })

            return values;
        }
    }))

    React.useEffect(() => {
        if (user) {
            form.controls.email.value = user.email;
            form.controls.password.value = user.password;
            onSubmit()
        } else {
            localState.loading = false;
        }
    }, [])


    const onChange = (value: string, control: FormControl<string>) => {
        control.value = value;
        form.isValid = onIsValid(form.controls);
    }

    const onSubmit = async () => {
        localState.loading = true;

        try {
            const {
                email: {
                    value: email
                },
                password: {
                    value: password
                }
            } = form.controls;
            const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (user) {
                auth.user = user;
                setUser({
                    email,
                    password
                });
            }
            localState.loading = false;

        } catch (error) {
            form.error = error.message;
            removeUser();
            localState.loading = false;
        }
    }

    return (
        <form className={classNames({ withSpinner: localState.loading })} >
            {
                localState.loading ? (
                    <CircularProgress disableShrink />
                ) : (
                        <>
                            <TextField
                                type="email"
                                placeholder="Email"
                                error={!form.controls.email.valid && !!form.controls.email.value}
                                defaultValue={form.controls.email.value}
                                onChange={e => onChange(e.target.value, form.controls.email)}
                            />
                            <TextField
                                type="password"
                                placeholder="Password"
                                error={!form.controls.password.valid && !!form.controls.password.value}
                                className={classNames({ error: !form.controls.password.valid })}
                                defaultValue={form.controls.password.value}
                                onChange={e => onChange(e.target.value, form.controls.password)}

                            />
                            <Button type="button" onClick={onSubmit}>
                                Login
                            </Button>
                            {
                                (!form.isValid || form.error) && (
                                    <span className="error-msg">
                                        {form.error || ('Form Not Valid')}
                                    </span>
                                )
                            }
                        </>
                    )
            }
        </form >
    );
};

export default observer(Login);

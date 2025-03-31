import {ReactNode} from "react";

export type ButtonProps = {
    size?: "small" | "large";
    label?: string;
    icon?: string;
    type: 'submit' | 'button';
    form?: string ;
    onClick?: () => void;
    severity?: 'danger';
    outlined?:boolean;
}

export type DialogProps = {
    maximizable?: boolean;
    header: any;
    footer?: any;
    visible: boolean;
    width?: string;
    modal?: boolean;
    className?: string;
    onHide: () => void;
    children: ReactNode; // Allows any React children to be passed
};

export type IconProps = {
    icon: string;
    onClick?: () => void;
}

export type  ImageProps ={
    src :string
    width:string
}

export type MessageProps = {
    text: string;
    severity: 'error' | 'info';
}

export type ToastProps = {
    ref: any
}

export type UploadProps = {
    url: string;
    onUpload?: () => void;
}

export type SelectButtonProps = {
    value:any;
    onChange: (value: any) => void;
    options: {value:string, label:string, icon:string}[];
}

export type ConfirmDialogProps = {
    rejectLabel:string,
    acceptLabel:string,
    tagKey:string,
}
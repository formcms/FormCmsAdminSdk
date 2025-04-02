import {GeneralComponentConfig} from "../ComponentConfig";

export function createConfirm(id: any, componentConfig: GeneralComponentConfig) {
    const ConfirmDialog = componentConfig.etc.confirmDialog;
    return {
        confirm: (message: any, header: any, accept: any) => {
            componentConfig.etc.confirm(message, header, id, accept);
        },
        Confirm: () => <ConfirmDialog rejectLabel={componentConfig.confirmLabels.reject}
                                      acceptLabel={componentConfig.confirmLabels.accept} tagKey={id}/>
    }
}
import axios from "axios";
import useSWR  from "swr";
import {catchResponse, fetcher, swrConfig} from "../../utils/apiUtils";
import {fullAuthApiUrl} from "../configs";
import {UserAccess} from "../types/userAccess";
import {ChangePasswordReq} from "../types/changePasswordReq";
import {RegisterReq} from "../types/registerReq";
import {LoginReq} from "../types/loginReq";

//login
export async function login(item: LoginReq )  {
    return catchResponse(() => axios.post(fullAuthApiUrl(`/login`), item));
}

export async function register(item: RegisterReq) {
    return catchResponse(() => axios.post(fullAuthApiUrl(`/register`), item));
}

export async function logout() {
    return catchResponse(() => axios.get(fullAuthApiUrl(`/logout`)));
}

export  function getBackendGithubUrl() {
    return fullAuthApiUrl(`/ext_login/GitHub/`);
}

//identity
export function useUserInfo() {
    return useSWR<UserAccess>(fullAuthApiUrl(`/me`), fetcher, swrConfig)
}

//profile
export async function changePassword(item: ChangePasswordReq) {
    return catchResponse(() => axios.post(fullAuthApiUrl(`/profile/password`), item));
}

export async function uploadAvatar(file:any) {
    const formData = new FormData();
    formData.append("file", file);

    return catchResponse(() =>
        axios.post(fullAuthApiUrl(`/profile/avatar`), formData, {
            headers: {"Content-Type": "multipart/form-data"},
        })
    );
}


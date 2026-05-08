export class ForgotPwdResponse {
    password!: string;
    confirmPassword!: string;
    email!: string;

    public constructor(init?: Partial<ForgotPwdResponse>) {
        Object.assign(this, init);
    }
}

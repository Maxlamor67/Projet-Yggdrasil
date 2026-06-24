// test/__mocks__/@thallesp/nestjs-better-auth.ts
export const AllowAnonymous = () => () => undefined;

export const AuthModule = {
  forRoot: () => ({
    module: class AuthModuleMock {},
  }),
};

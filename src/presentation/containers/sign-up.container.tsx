import * as React from 'react';
import { AuthContainer } from './auth.container';
import { SignUpView } from '../views/sign-up.view';

export default function SignUpRoute(): React.ReactElement {
  return <AuthContainer intent="signUp" view={SignUpView} />;
}

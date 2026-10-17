import * as React from 'react';
import { AuthContainer } from './auth.container';
import { SignUpView } from '../views/sign-up.view';

export default function SignUpRoute(): React.ReactElement {
  return <AuthContainer data-vid="rlqh7ki" intent="signUp" view={SignUpView} />;
}

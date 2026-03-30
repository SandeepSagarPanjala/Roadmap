import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Exoplanet = {
  __typename?: 'Exoplanet';
  discoveredBy?: Maybe<Scalars['String']['output']>;
  discoveredOn?: Maybe<Scalars['String']['output']>;
  distanceFromEarthLy?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  leadResearcherId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  scientificName?: Maybe<Scalars['String']['output']>;
  solarSystemName?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addExoplanet?: Maybe<Exoplanet>;
  addUser?: Maybe<User>;
  loginUser?: Maybe<AuthPayload>;
  logoutUser?: Maybe<Scalars['Boolean']['output']>;
  refreshSession?: Maybe<AuthPayload>;
};

export type MutationAddExoplanetArgs = {
  discoveredBy?: InputMaybe<Scalars['String']['input']>;
  discoveredOn?: InputMaybe<Scalars['String']['input']>;
  distanceFromEarthLy?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  leadResearcherId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  scientificName?: InputMaybe<Scalars['String']['input']>;
  solarSystemName?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAddUserArgs = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type MutationLoginUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllExoplanets?: Maybe<Array<Exoplanet>>;
  getAllUsers?: Maybe<Array<User>>;
  getUserByUsername?: Maybe<User>;
};

export type QueryGetUserByUsernameArgs = {
  username: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type LoginUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;

export type LoginUserMutation = {
  __typename?: 'Mutation';
  loginUser?: {
    __typename?: 'AuthPayload';
    accessToken?: string | null;
    user?: {
      __typename?: 'User';
      id?: string | null;
      username?: string | null;
      email?: string | null;
      displayName?: string | null;
    } | null;
  } | null;
};

export type RefreshSessionMutationVariables = Exact<{ [key: string]: never }>;

export type RefreshSessionMutation = {
  __typename?: 'Mutation';
  refreshSession?: {
    __typename?: 'AuthPayload';
    accessToken?: string | null;
    user?: { __typename?: 'User'; id?: string | null; username?: string | null } | null;
  } | null;
};

export type LogoutUserMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutUserMutation = { __typename?: 'Mutation'; logoutUser?: boolean | null };

export type AddUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;

export type AddUserMutation = {
  __typename?: 'Mutation';
  addUser?: {
    __typename?: 'User';
    id?: string | null;
    username?: string | null;
    email?: string | null;
  } | null;
};

export type GetAllExoplanetsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllExoplanetsQuery = {
  __typename?: 'Query';
  getAllExoplanets?: Array<{
    __typename?: 'Exoplanet';
    id?: string | null;
    name?: string | null;
    scientificName?: string | null;
    imageUrl?: string | null;
    discoveredOn?: string | null;
    discoveredBy?: string | null;
    distanceFromEarthLy?: string | null;
    solarSystemName?: string | null;
  }> | null;
};

export const LoginUserDocument = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      accessToken
      user {
        id
        username
        email
        displayName
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoginUserGQL extends Apollo.Mutation<LoginUserMutation, LoginUserMutationVariables> {
  override document = LoginUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RefreshSessionDocument = gql`
  mutation RefreshSession {
    refreshSession {
      accessToken
      user {
        id
        username
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RefreshSessionGQL extends Apollo.Mutation<
  RefreshSessionMutation,
  RefreshSessionMutationVariables
> {
  override document = RefreshSessionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LogoutUserDocument = gql`
  mutation LogoutUser {
    logoutUser
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LogoutUserGQL extends Apollo.Mutation<
  LogoutUserMutation,
  LogoutUserMutationVariables
> {
  override document = LogoutUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddUserDocument = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddUserGQL extends Apollo.Mutation<AddUserMutation, AddUserMutationVariables> {
  override document = AddUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetAllExoplanetsDocument = gql`
  query GetAllExoplanets {
    getAllExoplanets {
      id
      name
      scientificName
      imageUrl
      discoveredOn
      discoveredBy
      distanceFromEarthLy
      solarSystemName
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetAllExoplanetsGQL extends Apollo.Query<
  GetAllExoplanetsQuery,
  GetAllExoplanetsQueryVariables
> {
  override document = GetAllExoplanetsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

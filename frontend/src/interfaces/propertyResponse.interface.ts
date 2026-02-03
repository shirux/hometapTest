import { IPropertyModel } from ".";

export interface IProvidersResponse {
  providers: IProvider;
}

export interface IProvider {
  [key: string]: IPropertyModel;
}

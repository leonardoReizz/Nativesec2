export interface ISafeBoxGroupRepositoryAPIInterface {
  list(organizationId: string, authorization: string): Promise<APIResponse>;
}

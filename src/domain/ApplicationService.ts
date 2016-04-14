export interface ApplicationService {
    execute(request: Object): Promise<any>;
}

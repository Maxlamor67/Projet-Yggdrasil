import { Project } from './project';
import { Route } from './route';
import { GeometryPoint } from './geometry_point';
export declare class GeometryRelations {
    project: Project;
    route?: Route;
    geometryPoints: GeometryPoint[];
}

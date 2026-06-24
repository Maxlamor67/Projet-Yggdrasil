"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModel = void 0;
const account_relations_1 = require("./account_relations");
const action_relations_1 = require("./action_relations");
const attention_point_relations_1 = require("./attention_point_relations");
const geometry_relations_1 = require("./geometry_relations");
const geometry_point_relations_1 = require("./geometry_point_relations");
const photo_relations_1 = require("./photo_relations");
const point_relations_1 = require("./point_relations");
const point_to_secure_relations_1 = require("./point_to_secure_relations");
const project_relations_1 = require("./project_relations");
const route_relations_1 = require("./route_relations");
const safety_equipment_relations_1 = require("./safety_equipment_relations");
const safety_equipment_point_relations_1 = require("./safety_equipment_point_relations");
const safety_equipment_type_relations_1 = require("./safety_equipment_type_relations");
const safety_equipment_type_length_relations_1 = require("./safety_equipment_type_length_relations");
const session_relations_1 = require("./session_relations");
const team_relations_1 = require("./team_relations");
const transfer_relations_1 = require("./transfer_relations");
const user_relations_1 = require("./user_relations");
const verification_relations_1 = require("./verification_relations");
const account_1 = require("./account");
const action_1 = require("./action");
const attention_point_1 = require("./attention_point");
const geometry_1 = require("./geometry");
const geometry_point_1 = require("./geometry_point");
const photo_1 = require("./photo");
const point_1 = require("./point");
const point_to_secure_1 = require("./point_to_secure");
const project_1 = require("./project");
const route_1 = require("./route");
const safety_equipment_1 = require("./safety_equipment");
const safety_equipment_point_1 = require("./safety_equipment_point");
const safety_equipment_type_1 = require("./safety_equipment_type");
const safety_equipment_type_length_1 = require("./safety_equipment_type_length");
const session_1 = require("./session");
const team_1 = require("./team");
const transfer_1 = require("./transfer");
const user_1 = require("./user");
const verification_1 = require("./verification");
var PrismaModel;
(function (PrismaModel) {
    class AccountRelations extends account_relations_1.AccountRelations {
    }
    PrismaModel.AccountRelations = AccountRelations;
    class ActionRelations extends action_relations_1.ActionRelations {
    }
    PrismaModel.ActionRelations = ActionRelations;
    class AttentionPointRelations extends attention_point_relations_1.AttentionPointRelations {
    }
    PrismaModel.AttentionPointRelations = AttentionPointRelations;
    class GeometryRelations extends geometry_relations_1.GeometryRelations {
    }
    PrismaModel.GeometryRelations = GeometryRelations;
    class GeometryPointRelations extends geometry_point_relations_1.GeometryPointRelations {
    }
    PrismaModel.GeometryPointRelations = GeometryPointRelations;
    class PhotoRelations extends photo_relations_1.PhotoRelations {
    }
    PrismaModel.PhotoRelations = PhotoRelations;
    class PointRelations extends point_relations_1.PointRelations {
    }
    PrismaModel.PointRelations = PointRelations;
    class PointToSecureRelations extends point_to_secure_relations_1.PointToSecureRelations {
    }
    PrismaModel.PointToSecureRelations = PointToSecureRelations;
    class ProjectRelations extends project_relations_1.ProjectRelations {
    }
    PrismaModel.ProjectRelations = ProjectRelations;
    class RouteRelations extends route_relations_1.RouteRelations {
    }
    PrismaModel.RouteRelations = RouteRelations;
    class SafetyEquipmentRelations extends safety_equipment_relations_1.SafetyEquipmentRelations {
    }
    PrismaModel.SafetyEquipmentRelations = SafetyEquipmentRelations;
    class SafetyEquipmentPointRelations extends safety_equipment_point_relations_1.SafetyEquipmentPointRelations {
    }
    PrismaModel.SafetyEquipmentPointRelations = SafetyEquipmentPointRelations;
    class SafetyEquipmentTypeRelations extends safety_equipment_type_relations_1.SafetyEquipmentTypeRelations {
    }
    PrismaModel.SafetyEquipmentTypeRelations = SafetyEquipmentTypeRelations;
    class SafetyEquipmentTypeLengthRelations extends safety_equipment_type_length_relations_1.SafetyEquipmentTypeLengthRelations {
    }
    PrismaModel.SafetyEquipmentTypeLengthRelations = SafetyEquipmentTypeLengthRelations;
    class SessionRelations extends session_relations_1.SessionRelations {
    }
    PrismaModel.SessionRelations = SessionRelations;
    class TeamRelations extends team_relations_1.TeamRelations {
    }
    PrismaModel.TeamRelations = TeamRelations;
    class TransferRelations extends transfer_relations_1.TransferRelations {
    }
    PrismaModel.TransferRelations = TransferRelations;
    class UserRelations extends user_relations_1.UserRelations {
    }
    PrismaModel.UserRelations = UserRelations;
    class VerificationRelations extends verification_relations_1.VerificationRelations {
    }
    PrismaModel.VerificationRelations = VerificationRelations;
    class Account extends account_1.Account {
    }
    PrismaModel.Account = Account;
    class Action extends action_1.Action {
    }
    PrismaModel.Action = Action;
    class AttentionPoint extends attention_point_1.AttentionPoint {
    }
    PrismaModel.AttentionPoint = AttentionPoint;
    class Geometry extends geometry_1.Geometry {
    }
    PrismaModel.Geometry = Geometry;
    class GeometryPoint extends geometry_point_1.GeometryPoint {
    }
    PrismaModel.GeometryPoint = GeometryPoint;
    class Photo extends photo_1.Photo {
    }
    PrismaModel.Photo = Photo;
    class Point extends point_1.Point {
    }
    PrismaModel.Point = Point;
    class PointToSecure extends point_to_secure_1.PointToSecure {
    }
    PrismaModel.PointToSecure = PointToSecure;
    class Project extends project_1.Project {
    }
    PrismaModel.Project = Project;
    class Route extends route_1.Route {
    }
    PrismaModel.Route = Route;
    class SafetyEquipment extends safety_equipment_1.SafetyEquipment {
    }
    PrismaModel.SafetyEquipment = SafetyEquipment;
    class SafetyEquipmentPoint extends safety_equipment_point_1.SafetyEquipmentPoint {
    }
    PrismaModel.SafetyEquipmentPoint = SafetyEquipmentPoint;
    class SafetyEquipmentType extends safety_equipment_type_1.SafetyEquipmentType {
    }
    PrismaModel.SafetyEquipmentType = SafetyEquipmentType;
    class SafetyEquipmentTypeLength extends safety_equipment_type_length_1.SafetyEquipmentTypeLength {
    }
    PrismaModel.SafetyEquipmentTypeLength = SafetyEquipmentTypeLength;
    class Session extends session_1.Session {
    }
    PrismaModel.Session = Session;
    class Team extends team_1.Team {
    }
    PrismaModel.Team = Team;
    class Transfer extends transfer_1.Transfer {
    }
    PrismaModel.Transfer = Transfer;
    class User extends user_1.User {
    }
    PrismaModel.User = User;
    class Verification extends verification_1.Verification {
    }
    PrismaModel.Verification = Verification;
    PrismaModel.extraModels = [
        AccountRelations,
        ActionRelations,
        AttentionPointRelations,
        GeometryRelations,
        GeometryPointRelations,
        PhotoRelations,
        PointRelations,
        PointToSecureRelations,
        ProjectRelations,
        RouteRelations,
        SafetyEquipmentRelations,
        SafetyEquipmentPointRelations,
        SafetyEquipmentTypeRelations,
        SafetyEquipmentTypeLengthRelations,
        SessionRelations,
        TeamRelations,
        TransferRelations,
        UserRelations,
        VerificationRelations,
        Account,
        Action,
        AttentionPoint,
        Geometry,
        GeometryPoint,
        Photo,
        Point,
        PointToSecure,
        Project,
        Route,
        SafetyEquipment,
        SafetyEquipmentPoint,
        SafetyEquipmentType,
        SafetyEquipmentTypeLength,
        Session,
        Team,
        Transfer,
        User,
        Verification,
    ];
})(PrismaModel || (exports.PrismaModel = PrismaModel = {}));
//# sourceMappingURL=index.js.map
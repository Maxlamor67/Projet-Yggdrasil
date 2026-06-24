import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsLowerOrHigherThan(otherProperty: (o: any) => any, checker: 'lower' | 'higher', validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isLowerOrHigherThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [otherProperty, checker],
            options: {
                message: `${propertyName} must be ${checker}`,
                ...validationOptions
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedFunction, checker] = args.constraints as [(o: any) => any, 'lower' | 'higher'];
                    const relatedValue = relatedFunction(args.object);
                    if (typeof value !== typeof relatedValue) {
                        return true;
                    }
                    if (checker === 'lower') {
                        return value < relatedValue;
                    } else if (checker === 'higher') {
                        return value > relatedValue;
                    }
                    return false;
                },
            },
        });
    };
}
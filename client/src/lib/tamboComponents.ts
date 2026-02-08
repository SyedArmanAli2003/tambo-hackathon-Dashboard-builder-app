import type { TamboComponent } from "@tambo-ai/react";
import { componentRegistry } from "@/lib/componentRegistry";

type ComponentRegistryEntry = {
  component: any;
  schema: any;
  description: string;
};

export const tamboComponents: TamboComponent[] = Object.entries(
  componentRegistry
).map(([name, { component, schema, description }]) => ({
  name: name as string,
  description: description as string,
  component: component as any,
  propsSchema: schema,
}));

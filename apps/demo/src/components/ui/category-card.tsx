import { NavLink } from "./nav";
import { Stack } from "./stack";
import { Text } from "./text";

type CategoryCardProps = {
  label: string;
  description: string;
  entries: { id: string; name: string; href: string }[];
  primaryHref: string;
};

export function CategoryCard({
  label,
  description,
  entries,
  primaryHref,
}: CategoryCardProps) {
  return (
    <article className="flex h-full flex-col rounded border border-border bg-card p-4 text-card-foreground transition-colors hover:border-accent-foreground/40">
      <NavLink
        to={primaryHref}
        tone="default"
        weight="semibold"
        className="no-underline"
      >
        {label}
      </NavLink>
      <Text size="sm" tone="muted" className="mt-1">
        {description}
      </Text>
      <Stack as="ul" gap="xs" className="mt-3 list-none p-0">
        {entries.slice(0, 4).map((e) => (
          <li key={e.id}>
            <NavLink to={e.href} size="sm" tone="muted">
              {e.name}
            </NavLink>
          </li>
        ))}
        {entries.length > 4 ? (
          <li>
            <Text as="span" size="xs" tone="muted">
              +{entries.length - 4} more
            </Text>
          </li>
        ) : null}
      </Stack>
    </article>
  );
}

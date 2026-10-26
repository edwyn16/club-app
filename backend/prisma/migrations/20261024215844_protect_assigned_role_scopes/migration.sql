-- Prevent changes to a role's scope while it has
-- active assignments in either assignment table.

CREATE OR REPLACE FUNCTION protect_assigned_role_scope()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.scope IS DISTINCT FROM OLD.scope THEN

    IF EXISTS (
      SELECT 1
      FROM user_club_roles
      WHERE role_id = OLD.id
        AND deleted_at IS NULL
    )
    OR EXISTS (
      SELECT 1
      FROM user_platform_roles
      WHERE role_id = OLD.id
        AND deleted_at IS NULL
    ) THEN

      RAISE EXCEPTION
        'Cannot change the scope of a role with active assignments';

    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_protect_assigned_role_scope
BEFORE UPDATE OF scope
ON roles
FOR EACH ROW
EXECUTE FUNCTION protect_assigned_role_scope();
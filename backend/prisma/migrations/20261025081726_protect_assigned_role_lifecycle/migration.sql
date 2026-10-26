-- Prevent deactivation or soft-deletion of roles
-- that still have active assignments.

CREATE OR REPLACE FUNCTION protect_assigned_role_lifecycle()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    (OLD.is_active = TRUE AND NEW.is_active = FALSE)
    OR
    (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
  ) THEN

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
        'Cannot deactivate or soft-delete a role with active assignments';

    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_protect_assigned_role_lifecycle
BEFORE UPDATE OF is_active, deleted_at
ON roles
FOR EACH ROW
EXECUTE FUNCTION protect_assigned_role_lifecycle();
-- Protect club role assignments against concurrent role changes.

CREATE OR REPLACE FUNCTION enforce_club_role_scope()
RETURNS TRIGGER AS $$
DECLARE
  valid_role_id UUID;
BEGIN
  SELECT id INTO valid_role_id
  FROM roles
  WHERE id = NEW.role_id
    AND scope = 'CLUB'
    AND deleted_at IS NULL
    AND is_active = TRUE
  FOR SHARE;

  IF valid_role_id IS NULL THEN
    RAISE EXCEPTION
      'Club role assignments require an active CLUB-scoped role';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Protect platform role assignments against concurrent role changes.

CREATE OR REPLACE FUNCTION enforce_platform_role_scope()
RETURNS TRIGGER AS $$
DECLARE
  valid_role_id UUID;
BEGIN
  SELECT id INTO valid_role_id
  FROM roles
  WHERE id = NEW.role_id
    AND scope = 'PLATFORM'
    AND deleted_at IS NULL
    AND is_active = TRUE
  FOR SHARE;

  IF valid_role_id IS NULL THEN
    RAISE EXCEPTION
      'Platform role assignments require an active PLATFORM-scoped role';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
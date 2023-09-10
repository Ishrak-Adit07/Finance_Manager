CREATE OR REPLACE TRIGGER CHECK_EDIT_BUDGET_INFO
BEFORE UPDATE
OF "Amount"
ON "Budgets"
FOR EACH ROW
DECLARE 
BEGIN
	IF :NEW."Amount" = 0 THEN
		:NEW."Amount" = :OLD."Amount";	
	END IF;
END;


--Edit Budget
--Delete Wallet/ Account
--Transaction validity
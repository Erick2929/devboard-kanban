.PHONY: run-local stop-local status

run-local:
	npx supabase start
	npm run dev & echo $$! > .dev.pid
	@echo "Dev server started (PID $$(cat .dev.pid))"

stop-local:
	@if [ -f .dev.pid ]; then \
		kill $$(cat .dev.pid) && rm .dev.pid && echo "Dev server stopped"; \
	else \
		echo "No dev server PID found"; \
	fi
	npx supabase stop

status:
	@echo "=== Supabase ===" && npx supabase status
	@echo "=== Vite ===" && if [ -f .dev.pid ] && kill -0 $$(cat .dev.pid) 2>/dev/null; then \
		echo "Running (PID $$(cat .dev.pid))"; \
	else \
		echo "Not running"; \
	fi

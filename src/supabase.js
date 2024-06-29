import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xilslucznwxvtjhswqrn.supabase.co'
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbHNsdWN6bnd4dnRqaHN3cXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzODE5NTcsImV4cCI6MjAzMzk1Nzk1N30.9j-oiqX30pyeFfpBcmXPfD55qvzbjHFVo2lbHk1nQpo'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

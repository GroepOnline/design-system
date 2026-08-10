#!/usr/bin/env python3
import json,re,sys
from pathlib import Path
TIERS={'hub','gold','silver','bronze'}
def validate(path):
 d=json.loads(Path(path).read_text())
 if d.get('schema_version')!='1': raise ValueError('schema_version must be string 1')
 s=d.get('source')
 if not isinstance(s,dict) or not isinstance(s.get('repository'),str): raise ValueError('source.repository required')
 if not re.fullmatch(r'[0-9a-f]{40}',s.get('commit_sha','')): raise ValueError('source.commit_sha must be immutable 40-char lowercase hex')
 if d.get('tier') not in TIERS: raise ValueError('invalid tier')
 if not isinstance(d.get('applicability'),list) or not d['applicability'] or not all(isinstance(x,str) and x for x in d['applicability']): raise ValueError('applicability must be non-empty strings')
 if not isinstance(d.get('commands'),list) or not all(isinstance(x,str) for x in d['commands']): raise ValueError('commands must be strings')
 if 'notes' in d and not isinstance(d['notes'],str): raise ValueError('notes must be string')
 return d
if __name__=='__main__':
 try: validate(sys.argv[1]); print('valid')
 except (OSError,ValueError,json.JSONDecodeError,IndexError) as e: print('invalid:',e,file=sys.stderr); raise SystemExit(1)

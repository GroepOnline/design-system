import importlib.util,json,tempfile,unittest
from pathlib import Path
p=Path(__file__).parents[1] / 'scripts' / 'validate-consumer-contract.py'; spec=importlib.util.spec_from_file_location('consumer_validator',p); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
class TestContract(unittest.TestCase):
 def write(self,d):
  t=tempfile.TemporaryDirectory(); p=Path(t.name)/'c.json'; p.write_text(json.dumps(d)); return t,p
 def test_valid(self):
  t,p=self.write({'schema_version':'1','source':{'repository':'x','commit_sha':'a'*40},'tier':'gold','applicability':['gui'],'commands':[]}); self.assertEqual(m.validate(p)['tier'],'gold'); t.cleanup()
 def test_rejects_branch(self):
  t,p=self.write({'schema_version':'1','source':{'repository':'x','commit_sha':'main'},'tier':'gold','applicability':['gui'],'commands':[]}); self.assertRaises(ValueError,m.validate,p); t.cleanup()
if __name__=='__main__': unittest.main()
